export function mapUiTypeToDbType(uiType: string): string {
  switch (uiType) {
    case 'text':
      return 'short_text';

    case 'textarea':
      return 'long_text';

    case 'multichoice':
      return 'mcq';

    case 'checkbox':
      return 'checkbox';

    case 'select':
      return 'dropdown';

    case 'file':
      return 'file_upload';

    case 'date':
      return 'date';

    case 'time':
      return 'time';

    case 'linearScale':
      return 'linear_scale';

    case 'grid':
      return 'grid';

    default:
      return uiType; // fallback (safe)
  }
}
