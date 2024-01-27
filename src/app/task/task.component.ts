import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { EventsService } from '../events.service';
import * as d3 from 'd3';
import { ChartConfig } from './chartConfig';
import { ObjectDto } from './dto/object.dto';
import { CoordinatesDto } from './dto/coordinates.dto';
import { saveAs } from 'file-saver';
import { SolutionDto } from './dto/solution.dto';
import { LocalSolution } from './dto/localSolution.dto';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent {
  @ViewChild('chart') chartContainer: ElementRef | null = null;
  @ViewChild('chartSection') chartSection: ElementRef | null = null;

  xScale: d3.ScaleLinear<number, number, never> | null = null;
  yScale: d3.ScaleLinear<number, number, never> | null = null;
  svg: d3.Selection<any, unknown, null, undefined> | null = null;

  solution: SolutionDto | null = null;

  chartProps: ChartConfig | null = null;
  targets: ObjectDto[] = [];

  localSolution: LocalSolution | null = null;

  ngOnInit() {

  }

  ngAfterViewInit() {
    const stringifiedJson = localStorage.getItem('solution');

    if (stringifiedJson) {
      try {
        this.localSolution = JSON.parse(stringifiedJson) as LocalSolution;
      } catch (error) {
        this.chartProps = new ChartConfig(
          window.innerHeight,
          this.chartSection?.nativeElement.offsetWidth as number,
        );

        this.drawChart();

        return;
      }

      this.chartProps = new ChartConfig(
        window.innerHeight,
        this.chartSection?.nativeElement.offsetWidth as number,
      );
      this.drawChart();

      if (this.localSolution.xMax && this.localSolution.yMax) {
        this.chartProps.updateAreaSize(
          this.localSolution.xMax,
          this.localSolution.yMax,
        );

        this.drawZone();
      }

      if (this.localSolution.objects?.length) {
        this.targets = this.localSolution.objects;

        this.drawFigures();
      }

      if (this.localSolution.solution) {
        this.solution = this.localSolution.solution

        this.drawResult();
      }

      
    } else {
      this.chartProps = new ChartConfig(
        window.innerHeight,
        this.chartSection?.nativeElement.offsetWidth as number,
      );
  
      this.drawChart();
    }
  }

  drawChart() {
    if (this.chartContainer == null || this.chartProps == null) {
      return;
    }

    const { padding, chartHeight, chartWidth, maxX, maxY } = this.chartProps;
    this.svg = d3
      .select(this.chartContainer.nativeElement)
      .attr('width', chartWidth)
      .attr('height', chartHeight)
      .attr("fill", "transparent");

    this.xScale = d3.scaleLinear().domain([0, maxX]).range([padding, chartWidth - padding]);
    this.yScale = d3.scaleLinear().domain([0, maxY]).range([chartHeight - padding, padding]);
    
    this.svg.append("g")
      .call(d3.axisBottom(this.xScale).tickFormat(d3.format("d")))
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${chartHeight - padding})`);
    
    this.svg.append("g")
      .call(d3.axisLeft(this.yScale).tickFormat(d3.format("d")))
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding}, 0)`);
  }

  drawFigures() {
    this.targets.forEach((target: ObjectDto) => {
      this.drawFigure(target.coordinates);
    });
  }

  drawFigure(coordinates: CoordinatesDto[]) {
    const parsed: [number, number][] = coordinates.map(
      coord => this.xScale && this.yScale && [this.xScale(coord.x), this.yScale(coord.y)]
    ) as [number, number][];
    
    const line = d3.line<[number, number]>()
      .x(([x]) => x)
      .y(([,y]) => y);
    
    this.svg?.append('path')
      .data([parsed])
      .attr('d', line)
      .attr('stroke', 'black')
      .attr('fill', 'black');
  }

  clearChart() {
    this.svg?.selectAll("*").remove();
    this.drawChart();
  }

  drawZone() {
    if (this.xScale == null || this.yScale == null || this.chartProps == null) {
      return;
    }

    const { areaWidth, areaHeight } = this.chartProps;

    this.svg?.append("rect")
      .attr("x", this.xScale(0))
      .attr("y", this.yScale(areaHeight))
      .attr("width", this.xScale(areaWidth) - this.xScale(0))
      .attr("height", this.yScale(0) - this.yScale(areaHeight))
      .attr("stroke", "#32a852")
      .attr("fill", "#32a852");
  }

  constructor(
    private appService : AppService,
    private modalService: ModalService,
    private eventsService : EventsService,
    private router : Router
  ) {}

  openSaveSolution() {
    this.modalService.openSaveSolutionModal();
  }
  drawResult() {
    if (!this.solution) {
      return;
    }

    this.drawLine(this.solution?.start.start, this.solution?.start.end);
    this.drawLine(this.solution?.finish.start, this.solution?.finish.end);
  }
  drawLine(start: CoordinatesDto, end: CoordinatesDto) {
    if (!this.xScale || !this.yScale) {
      return;
    }

    this.svg?.append('line')
      .attr('x1', this.xScale(start.x))
      .attr('y1', this.yScale(start.y))
      .attr('x2', this.xScale(end.x))
      .attr('y2', this.yScale(end.y))
      .attr('stroke', 'red');
  }
  findPathForm: FormGroup = new FormGroup({
    algorithm: new FormControl('1'),
  });
  findPathFormSubmit() {
    const algorithm: string = this.findPathForm.value.algorithm;

    const dto = {
        algorithm: Number(algorithm),
        task: {
            xMax: this.chartProps?.areaWidth,
            yMax: this.chartProps?.areaHeight,
            objects: this.targets,
        }
    };

    if (algorithm && this.targets.length) {
      this.appService.findPath(dto)
        .subscribe((solution: object) => {
          this.solution = solution as SolutionDto;
          if (this.localSolution) {
            this.localSolution.solution = solution as SolutionDto;
            localStorage.setItem('solution', JSON.stringify(this.localSolution));
          }
          this.clearChart();
          this.drawZone();
          this.drawFigures();
          this.drawResult();
        }, (error) => {
          alert(error.error.message);
        });
    }
  }
  randomTargetsForm: FormGroup = new FormGroup({
    num: new FormControl(ChartConfig.defaultTargetsNum),
    xMax: new FormControl(ChartConfig.defaultAreaWidth),
    yMax: new FormControl(ChartConfig.defaultAreaHeight),
  });
  randomTargetsFormSubmit() : void {
    const { xMax, yMax, num } = this.randomTargetsForm.value;
    if (!xMax || !yMax || !num) {
      return;
    }
    this.appService.randomFigures(xMax, yMax, num)
    .subscribe((data) => {
      this.targets = data as ObjectDto[];
      this.chartProps?.updateAreaSize(xMax, yMax);
      if (this.localSolution) {
        this.localSolution.solution = null;
      } else {
        this.localSolution = new LocalSolution();
      }

      this.localSolution.objects = data as ObjectDto[];
      this.localSolution.xMax = xMax;
      this.localSolution.yMax = yMax;
      this.solution = null;

      localStorage.setItem('solution', JSON.stringify(this.localSolution));
      this.clearChart();
      this.drawZone();
      this.drawFigures();
    }, (error) => {
      alert(error.error.message);
    });
  }

  xyTargetsForm: FormGroup = new FormGroup({
    xMax: new FormControl(''),
    yMax: new FormControl(''),
  });
  xyTargetsFormSubmit() : void {

  }
  convertToCSV(figuresData: ObjectDto[]) {
    const rows = [];
    const header = ["x1", "y1", "x2", "y2", "x3", "y3", "x4", "y4"];
    rows.push(header.join(","));

    figuresData.forEach(item => {
      const row = item.coordinates.map(coord => [coord.x, coord.y]).flat();
      rows.push(row.join(","));
    });

    return rows.join("\n");
  }

  downloadFigures() {
    const csvContent = this.convertToCSV(this.targets);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, 'coordinates.csv');
  }
}
