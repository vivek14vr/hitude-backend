import { Injectable, PipeTransform } from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';
@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: unknown) { if (typeof value === 'string') return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }); if (value && typeof value === 'object') return this.clean(value as Record<string, unknown>); return value; }
  private clean(value: Record<string, unknown>) { return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, typeof item === 'string' ? sanitizeHtml(item, { allowedTags: [], allowedAttributes: {} }) : item])); }
}

