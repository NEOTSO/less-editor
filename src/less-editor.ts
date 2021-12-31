export interface EditorConfig {
    id: string;
    tabWidth: number;
}

export class LessEditor {
    el: HTMLElement | null = null
    tabWidth: number = 4
    sel: Selection | null = window.getSelection()
    constructor(config: EditorConfig) {
        const { id, tabWidth } = config
        this.el = document.getElementById(id)
        this.tabWidth = tabWidth
        this.init()
    }

    init() {
        this.tabIndent()
        this.tabIndentReverse()
    }

    tabIndent() {
        const tabSpace = new Array(this.tabWidth).fill('\u00A0').join('')
        this.el?.addEventListener('keydown', e => {
            if (e.key === 'Tab') {
                e.preventDefault()
                // console.log(this.el?.children)
                // console.log(this.el?.childNodes)
                // console.log(this.sel?.anchorOffset)
                // console.log(this.sel?.rangeCount)
                const range = this.sel?.getRangeAt(0)
                if (this.sel?.isCollapsed) {
                    const anchorOffset = this.sel?.anchorOffset
                    const anchorNode = this.sel?.anchorNode
                    const lineNum = this.getLineNum(this.el?.childNodes as NodeList, anchorNode as Text)
                    console.log(anchorNode)
                    anchorNode?.insertData(anchorOffset, tabSpace)
                    setTimeout(() => {
                        range.setStart(anchorNode as Node, anchorOffset + this.tabWidth)
                        range.setEnd(anchorNode as Node, anchorOffset + this.tabWidth)
                    }, 0)
                }
            }
        })
    }

    tabIndentReverse() {

    }

    getLineNum(nodes: NodeList, node: Text) {
        return [...nodes].findIndex(item => {
            return item.contains(node)
        })
    }
}