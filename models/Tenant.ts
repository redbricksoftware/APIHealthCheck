import {isNullOrUndefined} from "util";
import {Error, ErrorType} from "./Error";
import {isNumber} from "util";

export class Tenant {
    tenantID: number;
    name: string;
    code: string;
    primaryUserID: number;

    validate(): Promise<Error[]> {
        let me = this;
        return new Promise(function (resolve, reject) {
            let errors: Error[] = new Array<Error>();

            if (isNullOrUndefined(me.name) || me.name.toString().trim() == '') {
                errors.push(new Error('name', 'name is a required field.', ErrorType.Error));
            }

            if (isNullOrUndefined(me.code) || me.code.toString().trim() == '') {
                errors.push(new Error('code', 'code is a required field.', ErrorType.Error));
            }

            if (isNullOrUndefined(me.primaryUserID) || me.primaryUserID < 1) {
                errors.push(new Error('primaryUserID', 'primaryUserID is a required field.', ErrorType.Error));
            }

            if (!isNumber(me.primaryUserID)) {
                errors.push(new Error('primaryUserID', 'primaryUserID is not a valid number.', ErrorType.Error));
            }

            if (errors.length > 0) {
                reject(errors);
            } else {
                resolve(true);
            }
        });
    }
}