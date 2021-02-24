import { format as printf } from "util";

export default class MangleExpressionMock {
  private patternTemplate: string;
  private execMatchIndex: number;
  private replaceTemplate: string;

  constructor(
    patternTemplate: string,
    execMatchIndex: number,
    replaceTemplate: string,
  ) {
    this.patternTemplate = patternTemplate;
    this.execMatchIndex = execMatchIndex;
    this.replaceTemplate = replaceTemplate;
  }

  public * exec(s: string, pattern: string): IterableIterator<string> {
    const regExp = this.newRegExp(pattern);
    let match: RegExpExecArray | null = null;
    while ((match = regExp.exec(s)) !== null) {
      yield match[this.execMatchIndex];
    }
  }

  public replaceAll(s: string, replacements: Map<string, string>): string {
    replacements.forEach((to, from) => {
      s = this.replace(s, from, to);
    });

    return s;
  }

  private replace(s: string, pattern: string, to: string): string {
    const regExp = this.newRegExp(pattern);
    return s.replace(regExp, printf(this.replaceTemplate, to));
  }

  private newRegExp(pattern: string): RegExp {
    const rawExpr = printf(this.patternTemplate, pattern);
    return new RegExp(rawExpr, "gm");
  }
}
