import * as puppeteer from 'puppeteer';
import deasync = require('deasync');
import { randomBytes } from 'crypto';
import { ISize } from 'selenium-webdriver';
import * as tmp from 'tmp';
import * as rimraf from 'rimraf';
import { ProtractorBrowser } from 'lib';

export class PuppeteerHandle {
    private static registeredInstances: PuppeteerHandle[] = [];
    public static bundledPath: string = puppeteer.executablePath();
    private static tearDownRegistered: boolean = false;
    private static DEFAULT_WINDOW_SIZE: ISize = { width: 768, height: 1024 };
    private _size: ISize;
    public get size(): ISize {
        return this._size || PuppeteerHandle.DEFAULT_WINDOW_SIZE;
    }
    public set size(val: ISize) {
        this._size = val;
    }
    public get runtimeArgs(): string {
        return ((puppeteer as any).defaultArgs() as Array<string>).concat(this.launchArgs).join(' ');
    }
    public get address(): string {
        return /^ws:\/\/([^\/]+)\//.exec((this.browser as any)._connection._url)[1];
    }
    public get debuggerPort(): number {
        return parseInt(/:(\d+)/.exec(this.address)[1]);
    }
    public browser: puppeteer.Browser;
    private static tearDown() {
        for (let pup of this.registeredInstances) { deasync(callback => pup.quit().then(callback))(); }
    }
    public static get any(): boolean {
        return PuppeteerHandle.registeredInstances.length > 0;
    }
    public static async find(browser: ProtractorBrowser): Promise<PuppeteerHandle> {
        let content = randomBytes(20).toString('hex');
        let name = 'puppeterFindMe';
        await browser.executeScript(`window['${name}']='${content}';`);
        let found: PuppeteerHandle;
        for (let instance of PuppeteerHandle.registeredInstances) {
            for (let p of await instance.browser.pages()) {
                let res = await p.mainFrame().evaluate(name => {
                    let temp = window[name];
                    window[name] = undefined;
                    return temp;
                }, name);
                if (res === content) {
                    if (found) console.error(`Puppeteer Find: More than one instance contains ${content}`);
                    found = instance;
                }
            }
        }
        return found;
    }
    private static createInstance(headless: boolean = false, launchArgs: string[], userDataDir: string): puppeteer.Browser {
        return deasync(callback => {
            let tries = 0;
            let fn = () => puppeteer.launch({
                headless: headless,
                ignoreHTTPSErrors: true,
                userDataDir: userDataDir,
                args: [].concat(launchArgs),
            }).then(res => callback(null, res)).catch(err => {
                if (tries < 10) return fn();
                else callback(err);
            });
            fn();
        })();
    }
    private tmpDirHandle: tmp.SynchrounousResult;
    constructor(private headless: boolean = false,
        private launchArgs: string[] = [
            '--no-sandbox',
            '--no-proxy-server',
            '--ignore-certificate-errors',
            '--disable-background-networking',
            '--disable-client-side-phishing-detection',
            '--disable-default-apps',
            '--disable-hang-monitor',
            '--disable-popup-blocking',
            '--disable-prompt-on-repost',
            '--disable-sync',
            '--disable-web-resources',
            '--enable-automation',
            '--enable-logging',
            '--force-fieldtrials=SiteIsolationExtensions/Control',
            '--log-level=0',
            '--metrics-recording-only',
            '--no-first-run',
            '--password-store=basic',
            '--test-type=webdriver',
            '--use-mock-keychain',
        ],
        public userDataDir?: string) {
        if (!userDataDir) {
            this.tmpDirHandle = tmp.dirSync({ prefix: 'puppeteer' });
            this.userDataDir = this.tmpDirHandle.name;
        }
        // if lighthouse && !headless ==> '--show-paint-rects'
        if (!PuppeteerHandle.tearDownRegistered) {
            process.on('beforeExit', PuppeteerHandle.tearDown);
            PuppeteerHandle.tearDownRegistered = true;
        }
        PuppeteerHandle.registeredInstances.push(this);
        let ws = launchArgs.find(arg => arg.startsWith('--window-size'));
        if (!ws)
            launchArgs.concat(`--window-size=${PuppeteerHandle.DEFAULT_WINDOW_SIZE.width},${PuppeteerHandle.DEFAULT_WINDOW_SIZE.height}`);
        else {
            let res = /--window-size=(\d+),(\d+)/.exec(ws);
            if (res) this._size = { width: parseInt(res[1]), height: parseInt(res[2]) };
        }
        this.browser = PuppeteerHandle.createInstance(headless, launchArgs, this.userDataDir);
        console.log(`Chrome Headless: Started! You can connect using devtools on the following address: ${this.address}`);
    }
    private didQuit: boolean = false;
    public async quit() {
        if (!this.didQuit) {
            this.didQuit = true;
            await this.browser.close();
            if (this.tmpDirHandle) {
                rimraf.sync(this.tmpDirHandle.name);
            }
            PuppeteerHandle.registeredInstances.splice(PuppeteerHandle.registeredInstances.findIndex(el => el === this), 1);
        }
    }
    public async restart(newUserDir: boolean = true) {
        await this.browser.close();
        if (newUserDir) {
            if (this.tmpDirHandle) {
                rimraf.sync(this.tmpDirHandle.name);
            }
            this.tmpDirHandle = tmp.dirSync({ prefix: 'puppeteer' });
            this.userDataDir = this.tmpDirHandle.name;
        }
        this.browser = PuppeteerHandle.createInstance(this.headless,
            this.launchArgs.concat(`--remote-debugging-port=${this.debuggerPort}`),
            this.userDataDir);
        console.log(`Chrome Headless - Restarted, available on ${this.address}`);
    }
}

