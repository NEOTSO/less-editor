import './style.css'

// const app = document.querySelector<HTMLDivElement>('#app')!
import { EditorConfig, LessEditor } from './less-editor'

const editConfig: EditorConfig = {
    id: 'less-editor',
    tabWidth: 4,
}

const editor = new LessEditor(editConfig)
console.log(editor)