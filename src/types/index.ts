export interface URLAnalysisResult {
  id: number;
  url: string;
  title: string | null;
  htmlVersion: string | null;
  internalLinks: number | null;
  externalLinks: number | null;
  status: "Queued" | "Running" | "Done" | "Error";
  loginForm: boolean | null;
  validFrom: string;
  validUntil: string;
}

export interface BrokenLink {
  url: string;
  statusCode: number;
  type: "internal" | "external";
}

export interface URLDataWithBrokenLink extends URLAnalysisResult {
  brokenLinks: BrokenLink[];
}

export interface TableColumn<T1, T2 = undefined> {
  name: string;
  label: string;
  render?: (row: T1, rowActions: T2) => React.ReactNode;
}

export interface TableProps<T1, T2 = undefined> {
  rows: T1[];
  columns: TableColumn<T1, T2>[];
  unqieKeyInRows: string;
  rowClicked?: (uniqueKeyInRow: string) => void;
  showCheckbox?: boolean;
  rowActions?: T2;
  pagination?: {
    defaultPageSize?: number;
    pageSizeOptions: number[];
  };
  footer?: {
    buttonOne: {
      title: string;
      className: string;
      onAddUrl: () => void;
    };
  };
}

export interface PopupFormProps {
  showPopup: boolean;
  onNewEntry: (newEntry: any) => void;
  onClosePopup: () => void;
}
