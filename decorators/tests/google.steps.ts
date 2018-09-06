import { binding, given, then } from 'cucumber-tsflow';
import { GooglePage } from 'objects/pages/google';
import { GoogleData } from './data';
import { GoogleSearch } from 'objects/pages/search';
import { expect } from 'framework/helpers';

@binding([GoogleData])
class GoogleTests {
    constructor(private data: GoogleData) { }
    @given(/I perform a search/)
    public async runSearch() {
        let page = await new GooglePage().navigateToPage();
        await page.load();
        await page.fill(this.data.searchModel);
        await page.next();
    }
    @then(/I have search results/)
    public async getSearchResults() {
        let page = await GoogleSearch.WaitForPage<GoogleSearch>(GoogleSearch);
        await page.init();
        expect(page.results).to.be.not.null;
        console.log(`Results are: ${page.results.map(r => r.text).join('\n')}`);
    }
}

export = GoogleTests;