export function mapUiTypeToDbType(uiType: string): string {
  const map: Record<string, string> = {
    text: 'short_text',
    textarea: 'long_text',
    multichoice: 'mcq',
    checkbox: 'checkbox',
    select: 'dropdown',
    file: 'file_upload',
    date: 'date',
    time: 'time',
  };

  return map[uiType] ?? 'short_text';
}
