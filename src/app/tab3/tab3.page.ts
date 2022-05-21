import { Component } from '@angular/core';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
    public chunksToDisplay: { mapId: string; chunksPosition: string }[] = [];

    constructor() {}

    public requestFiles(): void {
        this.chunksToDisplay = [];

        (
            window as any
        ).Capacitor.Plugins.SocketThread.retrieveChunksFromDevice().then(
            (resp: { chunks: string }) => {
                this.loadChunksToSee(resp.chunks);
            }
        );
    }

    private loadChunksToSee(chunks: string): void {
        for (const chunk of chunks.split('--BREAK--')) {
            if (chunk === '') {
                continue;
            }

            this.chunksToDisplay.push({
                mapId: chunk.slice(0, 20),
                chunksPosition: chunk.slice(20, 21),
            });
        }
    }
}
