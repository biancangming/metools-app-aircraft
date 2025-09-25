import '../../src/assets/styles/tailwind.css'
import { defineCustomElement } from '@vue/runtime-dom'
import app from "../../src/app.vue"
import info from "../../dist/index"
import pkg from "../../package.json"
const CustomElement = defineCustomElement(app)
customElements.define(pkg.name, CustomElement)