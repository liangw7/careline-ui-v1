export class OrderItem {
    name!: String;
    internalName!: String;
    medicationName!: String;
    label!: Object;
	orderType!: String;
	medsClass!: Object;
	copyOrder!: [];
	specialty!: String;
    uom!: String;
    labs!: [];
    images!: [];
    forms!: [];
    synonyms!: [];
    packageVolume!: String;
    packageType!: String;
    medForm!: String;
    dose!: String;
    allergyList!: [];
    items!: [];
    options!: [];
    obs!: [];
    coOrders!: [];
    conflictingOrders!: [];
    conflictingProblems!: [];
    educations!: [];
    validDays!: Number;
}
