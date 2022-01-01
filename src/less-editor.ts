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
        this.listenIndent()
    }

    listenIndent() {
        this.el?.addEventListener('keydown', e => {
            if (e.key === 'Tab') {
                e.preventDefault()
                if (e.shiftKey) {
                    this.tabIndentReverse()
                } else {
                    this.tabIndent()
                }

            }
        })
    }

    tabIndent() {
        const tabSpace = new Array(this.tabWidth).fill('\u00A0').join('')
        const range = this.sel?.getRangeAt(0)
        if (this.sel?.isCollapsed) {
            const anchorOffset = this.sel?.anchorOffset
            const anchorNode = this.sel?.anchorNode
            const lineNum = this.getLineNum(this.el?.childNodes as NodeList, anchorNode as Text)
            if (anchorNode?.nodeType === Node.ELEMENT_NODE) {
                const textNode = document.createTextNode(tabSpace)
                console.log(anchorNode.childNodes)
                anchorNode.replaceChild(textNode, anchorNode.childNodes[0])
                range.setStart(textNode, this.tabWidth)
                range.setEnd(textNode, this.tabWidth)
            } else if (anchorNode?.nodeType === Node.TEXT_NODE) {
                anchorNode?.insertData(anchorOffset, tabSpace)
                range.setStart(anchorNode as Node, anchorOffset + this.tabWidth)
                range.setEnd(anchorNode as Node, anchorOffset + this.tabWidth)
            }
        } else {
            const anchorOffset = this.sel?.anchorOffset
            const anchorNode = this.sel?.anchorNode
            console.log(anchorNode)
            anchorNode?.insertData(0, tabSpace);
        }
    }

    tabIndentReverse() {
        const tabSpace = new Array(this.tabWidth).fill('\u00A0').join('')
        // if (this.sel?.isCollapsed) {

        // }

        const anchorOffset = this.sel?.anchorOffset
        const anchorNode = this.sel?.anchorNode
        if (anchorNode?.nodeType === Node.TEXT_NODE) {
            const result = anchorNode.nodeValue?.match(/^\s{1,4}/)
            if (result) {
                anchorNode.deleteData(0, result[0].length)
            }
        }
    }

    getLineNum(nodes: NodeList, node: Text) {
        return [...nodes].findIndex(item => {
            return item.contains(node)
        })
    }
}