/**
 * Signals the direction of pagination or moving the cursor through a list.
 */
const enum Direction {
    /**
     * Move to the previous element
     */
    Previous,

    /**
     * Move to the next element
     */
    Next,
}

/**
 * Matches the `code` names for keys set by the user agent on [[KeyboardEvent]].
 * Only the relevant keys are kept here.
 */
const enum Key {
    OpenBracket = "BracketLeft",
    CloseBracket = "BracketRight",
    Enter = "Enter",
    A = "KeyA",
    C = "KeyC",
    D = "KeyD",
    F = "KeyF",
    H = "KeyH",
    J = "KeyJ",
    K = "KeyK",
    S = "KeyS",
    U = "KeyU",
}

/**
 * Matches the CSS selectors for the anchors inside a story element. The
 * selectors are relative to the selected story.
 */
const enum StoryAnchorSelector {
    URL = '.u-url',
    Domain = '.domain',
    Author = '.u-author',
    Flag = '.flagger',
    Hide = '.hider',
    Save = '.saver',
    Comments = '.comments_label a',
    Upvote = '.upvoter',
}

/**
 * Story element on the document.
 */
class Story {
    /**
     * The class name applied to the selected [[Story]]
     */
    public static readonly focusCls = 'lobster-keys-focus';

    private static readonly scrollOpts: ScrollIntoViewOptions = { block: "nearest" }

    private _el: Element;

    /**
     * Extracts all stories in-order from `d`.
     *
     * @param d Document
     */
    public static FromDoc(d: Document = window.document): Story[] {
        let els = d.getElementsByClassName('story')
        let out = []
        for (let el of els) {
            out.push(new Story(el))
        }

        return out;
    }

    private constructor(el: Element) {
        this._el = el;
    }

    /**
     * Selects this story, making the keybindings apply to this Story. If a
     * different story was previously seelcted, that story should be
     * unfocused first.
     */
    public focus(): void {
        this._el.classList.add(Story.focusCls);
        let url = this.getAnchor(StoryAnchorSelector.URL);
        if (url) {
            url.focus();
            url.blur();
        }
        this.scrollIntoView();
    }

    /**
     * Deselects this story.
     */
    public unfocus(): void {
        this._el.classList.remove(Story.focusCls);
    }

    /**
     * Opens the Story's URL
     */
    public open(): void { this.click(StoryAnchorSelector.URL); }

    /**
     * Opens the domain search page for the Story's hostname
     */
    public domain(): void { this.click(StoryAnchorSelector.Domain); }

    /**
     * Opens the Story's author's profile page.
     */
    public author(): void { this.click(StoryAnchorSelector.Author); }

    /**
     * Opens the flag dropdown menu, and moves focus to the first option.
     */
    public flag(): void {
        this.click(StoryAnchorSelector.Flag);
        let opts: HTMLAnchorElement | null = window.document.querySelector('#downvote_why a');
        opts && opts.focus();
    }

    /**
     * Toggles whether or not the Story is hidden.
     */
    public hide(): void { this.click(StoryAnchorSelector.Hide); }

    /**
     * Toggles whether or not the Story is saved.
     */
    public save(): void { this.click(StoryAnchorSelector.Save); }

    /**
     * Opens the Story's comments page.
     */
    public comments(): void { this.click(StoryAnchorSelector.Comments); }

    /**
     * Toggles the Story's upvote arrow.
     */
    public upvote(): void { this.click(StoryAnchorSelector.Upvote); }

    private getAnchor(a: StoryAnchorSelector): HTMLAnchorElement | null {
        return this._el.querySelector(a);
    }

    private click(a: StoryAnchorSelector): void {
        let anchor = this.getAnchor(a);
        anchor && anchor.click();
    }

    private scrollIntoView(): void {
        let bound = this._el.getBoundingClientRect();

        if (bound.top < 0
            || bound.left < 0
            || bound.bottom > (window.innerHeight || document.documentElement.clientHeight)
            || bound.right > (window.innerWidth || document.documentElement.clientWidth)) {
            return this._el.scrollIntoView(Story.scrollOpts);
        }
    }
}

/**
 * Interaction controller for the keybindings
 */
class LobstersKeyController {
    private stories: Story[];
    private _idx?: number;

    /**
     * Attaches a controller to `d`, listening for events and injecting styles
     * if a [[Story]] list is detected.
     *
     * @param d Document
     */
    public constructor(d: Document = window.document) {
        this.stories = Story.FromDoc(d);

        if (this.stories.length > 0) {
            document.addEventListener('keyup', (e): void => { this.handleKeyUp(e) });
            this.attachStyles(d);
        }
    }

    private get index(): number | undefined { return this._idx; }

    private set index(i: number | undefined) {
        if (i === undefined) {
            this._idx = undefined;
            return;
        }

        if (i < 0) {
            i = 0;
        } else if (i >= this.stories.length) {
            i = this.stories.length - 1;
        }

        this._idx = i;
    }

    private get story(): Story | undefined {
        let i = this.index;
        return i === undefined ? undefined : this.stories[i];
    }

    private changeStory(d: Direction): void {
        if (this.index === undefined) {
            switch (d) {
                case Direction.Next:
                    this.index = 0;
                    break;
                case Direction.Previous:
                    this.index = this.stories.length - 1;
                    break;
            }
        } else {
            this.story && this.story.unfocus();
            switch (d) {
                case Direction.Next:
                    this.index++;
                    break;
                case Direction.Previous:
                    this.index--;
                    break;
            }
        }

        this.story && this.story.focus();
    }

    private changePage(d: Direction): void {
        switch (d) {
            case Direction.Previous:
                let prev: HTMLAnchorElement | null = window.document.querySelector('.morelink a:first-child');
                prev && prev.innerText.indexOf('<<') > -1 && prev.click();
                break;
            case Direction.Next:
                let next: HTMLAnchorElement | null = window.document.querySelector('.morelink a:last-child');
                next && next.innerText.indexOf('>>') > -1 && next.click();
                break;
        }
    }

    private handleKeyUp(e: KeyboardEvent): void {
        switch (e.code as Key) {
            case Key.J:
                return this.changeStory(Direction.Next);
            case Key.K:
                return this.changeStory(Direction.Previous);
            case Key.OpenBracket:
                return this.changePage(Direction.Previous);
            case Key.CloseBracket:
                return this.changePage(Direction.Next);
        }

        let story = this.story;
        if (story) {
            switch (e.code as Key) {
                case Key.Enter:
                    return story.open();
                case Key.A:
                    return story.author();
                case Key.C:
                    return story.comments();
                case Key.D:
                    return story.domain();
                case Key.F:
                    return story.flag();
                case Key.H:
                    return story.hide();
                case Key.S:
                    return story.save();
                case Key.U:
                    return story.upvote();
            }
        }
    }

    private attachStyles(d: Document): void {
        let styles = d.createElement('style');
        styles.innerHTML = `.${Story.focusCls} { background-color: #fffcd799; }`;
        d.body.appendChild(styles);
    }
}

new LobstersKeyController(window.document);
