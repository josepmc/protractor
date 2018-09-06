import { AbstractFeature } from "framework/object/abstract";
import { injectable } from "framework/object/core/iConstructor";
import { Locator, By } from "framework/helpers";
import { LabelOptsMode, label } from "framework/object/core/decorators";

@injectable export class SearchResult extends AbstractFeature {
    public featureSelector: Locator = By.xpath('.//*[@class="r"]');
    @label<string>(By.xpath('.//a'), null, { mode: LabelOptsMode.Text }) public text: string;
}