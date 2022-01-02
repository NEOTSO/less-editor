export interface EditorConfig {
    id: string;
    tabWidth: number;
}

export class LessEditor {
    el: HTMLElement | null = null
    tabWidth: number = 4
    tabSpace: string = new Array(4).fill('\u00A0').join('')
    sel: Selection | null = window.getSelection()
    constructor(config: EditorConfig) {
        const { id, tabWidth } = config
        this.el = document.getElementById(id)
        this.tabWidth = tabWidth
        this.tabSpace = new Array(tabWidth).fill('\u00A0').join('')
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
                    this.reTab()
                } else {
                    this.tab()
                }
            }
        })
    }

    tab() {
        const range = this.sel?.getRangeAt(0)
        if (this.sel?.isCollapsed) {
            const anchorOffset = this.sel?.anchorOffset
            const anchorNode = this.sel?.anchorNode
            const lineNum = this.getLineNum(this.el?.childNodes as NodeList, anchorNode as Text)
            if (anchorNode?.nodeType === Node.ELEMENT_NODE) {
                const textNode = document.createTextNode(this.tabSpace)
                console.log(anchorNode.childNodes)
                anchorNode.replaceChild(textNode, anchorNode.childNodes[0])
                range.setStart(textNode, this.tabWidth)
                range.setEnd(textNode, this.tabWidth)
            } else if (anchorNode?.nodeType === Node.TEXT_NODE) {
                anchorNode?.insertData(anchorOffset, this.tabSpace)
                range.setStart(anchorNode as Node, anchorOffset + this.tabWidth)
                range.setEnd(anchorNode as Node, anchorOffset + this.tabWidth)
            }
        } else {
            const anchorOffset = this.sel?.anchorOffset
            const anchorNode = this.sel?.anchorNode
            const focusNode = this.sel?.focusNode
            this.el?.childNodes.forEach(item => {
                if (this.sel?.containsNode(item)) {
                    if (item !== anchorNode && item !== focusNode) {
                        this.indentNode(item)
                    }
                }
            })
            this.indentNode(anchorNode as Node)
            this.indentNode(focusNode as Node)
        }
    }

    reTab() {
        const anchorNode = this.sel?.anchorNode
        const focusNode = this.sel?.focusNode
        if (this.sel?.isCollapsed) {
            if (anchorNode?.nodeType === Node.TEXT_NODE) {
                const result = anchorNode.nodeValue?.match(/^\s{1,4}/)
                if (result) {
                    anchorNode.deleteData(0, result[0].length)
                }
            }
        } else {
            var reTabNodeList: Set<Node> = new Set()
            reTabNodeList.add(anchorNode as Node)
            reTabNodeList.add(focusNode as Node)
            this.el?.childNodes.forEach(item => {
                if (this.sel?.containsNode(item)) {
                    reTabNodeList.add(item)
                }
            });
            const result: Boolean = [...reTabNodeList].every(item => {
                if (item.nodeType === Node.TEXT_NODE) {
                    return this.isTextNodeStartWithTabSpace(item as Text)
                } else if (item.nodeType === Node.ELEMENT_NODE) {
                    if (item.childNodes[0].nodeType === Node.TEXT_NODE) {
                        return this.isTextNodeStartWithTabSpace(item.childNodes[0] as Text)
                    }
                }
                return false
            })
            if (result) {
                [...reTabNodeList].forEach(item => {
                    this.reIndentNode(item as Node)
                })
            }
        }
    }

    isTextNodeStartWithTabSpace(node: Text) {
        return node.nodeValue?.match(/^\s{4}/)
    }

    indentNode(node: Node) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.insertData(0, this.tabSpace)
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.childNodes[0].nodeType === Node.TEXT_NODE) {
                this.indentNode(node.childNodes[0])
            } else {
                const textNode = document.createTextNode(this.tabSpace)
                node.replaceChild(textNode, node.childNodes[0])
            }
        }
    }

    reIndentNode(node: Node) {
        if (node.nodeType === Node.TEXT_NODE) {
            this.reIndentTextNode(node as Text)
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.childNodes[0].nodeType === Node.TEXT_NODE) {
                this.reIndentTextNode(node.childNodes[0] as Text)
            }
        }
    }

    reIndentTextNode(node: Text) {
        const result = node.nodeValue?.match(/^\s{1,4}/)
        if (result) {
            node.deleteData(0, result[0].length)
        }
    }

    getLineNum(nodes: NodeList, node: Text) {
        return [...nodes].findIndex(item => {
            return item.contains(node)
        })
    }
}