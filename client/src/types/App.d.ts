export type StateProps = {
  longUrl: string;
  expiresIn: number;
  customCode: string;
};

export type DataResponse = {
  message: string;
  shortUrl: string;
  shortCode: string;
  longUrl: string;
};
