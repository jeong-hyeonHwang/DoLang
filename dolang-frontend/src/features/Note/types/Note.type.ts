export interface NoteResponse {
  createdAt: string;
  id: string;
  interestLanguageId: string;
  interestNote: string;
  nativeLanguageId: string;
  nativeNote: string;
  userId: number;
}

export interface NoteRequest {
  nativeNote: string;
  interestNote: string;
  nativeLanguageId: string;
  interestLanguageId: string;
}
