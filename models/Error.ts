export class Error {
    field: string;
    errorType: ErrorType;
    errorMessage: string;

    constructor(field: string, errorMessage: string, errorType: ErrorType) {
        this.field = field;
        this.errorMessage = errorMessage;
        this.errorType = errorType;
    }
}

export enum  ErrorType{
    Warning = 1,
    Error = 99
}