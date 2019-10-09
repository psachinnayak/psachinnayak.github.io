class Framework {
    static _id(id) {
        return document.getElementById(id);
    }
    static _class(clsName) {
        return document.getElementsByClassName(clsName);
    }
    static _listen(context, event, func){
        context.addEventListener(event, func);
    }
    static _create(tagName, txt=null){
        let tag = document.createElement(tagName);
        if(txt){
            txt = document.createTextNode(txt);
            tag.appendChild(txt);
        }
        return tag;

    }
}


window["Fwk"] = Framework;