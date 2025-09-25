import '../../src/assets/styles/tailwind.css'
import { defineCustomElement } from '@vue/runtime-dom'
import info from "../../dist/index"
import pkg from "../../package.json"
const CustomElement = defineCustomElement(info.entry)
customElements.define(pkg.name, CustomElement)