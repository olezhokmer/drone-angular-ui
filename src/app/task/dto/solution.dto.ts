import { LineDto } from './line.dto';

export class SolutionDto {
  start: LineDto;
  finish: LineDto;
  intersected: number[];
  percent: number;
  isSolution = true;
}
