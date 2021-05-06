export class Diagnosis {
    name!: String;
    internalName!: String;
    level!: Number;
    subDiagnosisList: [] = [];
    SubClass: [] = [];
    Meta: [] = [];
    Rubric: [] = [];
    chRubric: [] = [];
    SuperClass: [] = [];
    code!: String;
    kind!: String;
}
