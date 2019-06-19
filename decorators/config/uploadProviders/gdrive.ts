import { UploadProvider } from ".";

export class GoogleDrive extends UploadProvider {
    public static providerKey: string = 'GOOGLE_DRIVE';
    protected testsCompletedUpload(reportsDir: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    protected addTestValue(name: string, row: { [k: string]: string; }): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public init(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

UploadProvider.Register(GoogleDrive, GoogleDrive.providerKey);