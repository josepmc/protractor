import { IDataModelObject } from "framework/object/core";
import { oh } from "framework/helpers";

export class GoogleSearchModel extends IDataModelObject {
    public search: string = `something ${oh.chance.stringOrNone({ length: 2 })}`;
}