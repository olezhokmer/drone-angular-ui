export class ChartConfig {
    constructor(height: number, width: number) {
        this.chartHeight = height * this.chartHeightKoef;
        this.chartWidth = width ;
    }
    readonly padding: number = 30;
    readonly defaultAreaWidth: number = 500;
    readonly defaultAreaHeight: number = 500; 
    static readonly defaultAreaWidth: number = 500;
    static readonly defaultAreaHeight: number = 500; 
    static readonly defaultTargetsNum: number = 10;
    areaWidth: number = this.defaultAreaWidth;
    areaHeight: number = this.defaultAreaHeight;
    readonly chartHeightKoef: number = 0.6;
    readonly chartWidthKoef: number = 0.9;

    chartHeight: number;
    chartWidth: number;
    readonly maxCoordKoefY: number = 1.1;
    readonly maxCoordKoefX: number = 1.5;
    maxX: number = this.defaultAreaWidth * this.maxCoordKoefX;
    maxY: number = this.defaultAreaHeight * this.maxCoordKoefY;

    updateAreaSize(width: number, height: number) {
        this.areaWidth = width;
        this.areaHeight = height;
        this.maxX = width * this.maxCoordKoefX;
        this.maxY = height * this.maxCoordKoefY;
    }
}