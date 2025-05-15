export class LabelEncoder {
  private labelMap: Map<string, number>;
  private reverseMap: Map<number, string>;

  constructor() {
    this.labelMap = new Map();
    this.reverseMap = new Map();
  }

  encode(value: string): number {
    if (!this.labelMap.has(value)) {
      const newLabel = this.labelMap.size;
      this.labelMap.set(value, newLabel);
      this.reverseMap.set(newLabel, value);
    }
    return this.labelMap.get(value)!;
  }

  decode(label: number): string {
    return this.reverseMap.get(label) || '';
  }
}