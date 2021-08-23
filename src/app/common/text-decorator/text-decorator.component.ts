import {
    ChangeDetectionStrategy,
    Component,
    Input,
    SimpleChanges,
} from '@angular/core';
import {
    isEqual,
} from 'lodash';

interface SpanElement {
    text: string;
    isDecorated: boolean;
}

@Component({
    selector: 'dwu-text-decorator',
    templateUrl: './text-decorator.component.html',
    styleUrls: ['./text-decorator.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextDecoratorComponent {

    @Input() text = '';
    @Input() matchRanges: number[][] = [];
    @Input() ignoreUpdates = false;

    public spanElements: SpanElement[] = [];

    public ngOnChanges(changes: SimpleChanges) {
        if (this.ignoreUpdates) {
            return;
        }
        if (changes.text || changes.matchRanges) {
            const willResultingElementsChange = changes.text || !isEqual(changes.matchRanges.currentValue, changes.matchRanges.previousValue);
            if (willResultingElementsChange) {
                this.spanElements = this.getSpanElements();
            }
        }
    }

    public getSpanElements() {
        const indicesDecorated = new Set<number>();
        this.matchRanges.forEach((matchRange: number[]) => {
            for (let i = matchRange[0]; i <= matchRange[1]; i++) {
                indicesDecorated.add(i);
            }
        });

        const spanElements = [];
        let previousIndex = 0;
        let isPreviousDecorated = indicesDecorated.has(0);
        let isCurrentDecorated;
        for (let i = 1; i < this.text.length; i++) {
            isCurrentDecorated = indicesDecorated.has(i);
            if (isPreviousDecorated !== isCurrentDecorated) {
                spanElements.push({
                    text: this.text.slice(previousIndex, i),
                    isDecorated: isPreviousDecorated,
                });
                previousIndex = i;
                isPreviousDecorated = isCurrentDecorated;
            }
        }
        spanElements.push({
            text: this.text.slice(previousIndex),
            isDecorated: isCurrentDecorated,
        });
        return spanElements;
    }

    public trackByFn(spanElement: SpanElement) {
        return `${spanElement.text}${spanElement.isDecorated}`;
    }

}
