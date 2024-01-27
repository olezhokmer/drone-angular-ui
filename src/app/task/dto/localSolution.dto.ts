import { ObjectDto } from "./object.dto";
import { SolutionDto } from "./solution.dto";

export class LocalSolution {
    solution?: SolutionDto | null;
    objects: ObjectDto[] | null;
    xMax: number | null;
    yMax: number | null;
}