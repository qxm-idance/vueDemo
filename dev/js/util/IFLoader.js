export default class IFLoader {
    constructor(opts = {}) {
        this.opts = opts;
        this.createDom();
        this.loader();
    }
    loader() {
        this.fr.onload  = this.opts.callback;
        this.fr.onerror = this.opts.callback;
    }
    createDom() {
        let dom = document.createElement('iframe');
        dom.scrolling = 'no';
        dom.frameBorder = '0';
        dom.allowTransparency = 'true';
        dom.style.cssText = 'width: 100%; height: 100%; overflow: hidden;';
        dom.src = [this.opts.src,'&_r='+(+new Date)].join('');
        this.fr = dom;
        this.opts.id.appendChild(this.fr);
    }
}
