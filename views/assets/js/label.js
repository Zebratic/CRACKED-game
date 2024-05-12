class Label {
    constructor(data) {
        this.x = data.x;
        this.y = data.y;
        this.text = data.text;
        this.textSize = data.textSize || 16;
        this.color = data.color || { r: 255, g: 255, b: 255, a: 255 };
        this.outline = data.outline || { r: 0, g: 0, b: 0, a: 255 };
        this.outlineSize = data.outlineSize || 1;
        this.rainbow = data.rainbow || false;
        this.width = 0;
        this.height = 0;
    }

    draw(debugMode) {
        let lines = this.text.split('\n');
        this.height = this.textSize * lines.length * 1.1;
        let longestLine = 0;
        for (let line of lines) {
            let lineWidth = textWidth(line) * this.textSize / 16;
            if (lineWidth > longestLine) {
                longestLine = lineWidth;
            }
        }
        this.width = longestLine;

        // override color with rainbow using frameCount
        if (this.rainbow) {
            let hue = (frameCount % 360);
            this.color = { r: 255, g: 0, b: 0, a: this.color.a };
            this.color = this.hslToRgb(hue / 360, 1, 0.5);
        }

        // draw nice text
        fill(this.color.r, this.color.g, this.color.b, this.color.a);
        stroke(this.outline.r, this.outline.g, this.outline.b, this.outline.a);
        strokeWeight(this.outlineSize);
        textSize(this.textSize);
        textAlign(LEFT, TOP);
        text(this.text, this.x, this.y);

        // draw debug info
        if (debugMode) {
            noFill();
            stroke(255, 0, 0);
            strokeWeight(1);
            rect(this.x, this.y, this.width, this.height);
        }

        // reset stroke
        stroke(0);
        strokeWeight(1);
    }

    hslToRgb(h, s, l) {
        let r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            let q = l < 0.5 ? l * (1 + s) : l + s -  l * s;
            let p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    }

}

export default Label;