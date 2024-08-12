export interface InfoObat {
    kd_brgdg: string;
    // Add other properties as needed
  }
  
  export interface InfoObatState {
    infoObats: InfoObat[];
    isLoading: boolean;
    error: string | null;
  }