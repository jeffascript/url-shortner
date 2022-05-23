import React, { useCallback, useState } from "react";
import axios from "axios";
import { toaster, ClipboardIcon } from "evergreen-ui";
import { QueryClient, QueryClientProvider } from "react-query";
import { SHORTIFY_ENDPOINT, REDIRECT_ENDPOINT } from "../src/config";
import { useClipboardCopyHook } from "./hooks/copyClipBoard";
import Analytics from "./components/Analytics";
import { Container, StyledBox, StyledBtn, StyledInput } from "./App.Styles";
import { ReactQueryDevtools } from "react-query/devtools";
import { StateProps, DataResponse } from "./types/App";

const client = new QueryClient();

//alterantively, with useMemo...objects are non-primitive
const responseInit = {
  message: "",
  shortUrl: "",
  shortCode: "",
  longUrl: "",
};

const intialState = {
  longUrl: "",
  expiresIn: 60,
  customCode: "",
};

type AnalyticsData = {
  id: string;
  longUrl: string;
  shortCode: string;
  shortUrl: string;
  visitorCount: string;
  expiresIn: string;
  createdAt: string;
};

export function App() {
  const [data, setData] = useState<StateProps>(intialState);
  const [fetcheddata, setFetchedData] = useState<DataResponse>(responseInit);
  const [fetchErr, setFetchErr] = useState<unknown>(null);
  const [, copyUrl] = useClipboardCopyHook(fetcheddata.shortUrl);

  // handle onchange event
  const handleData = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, text: string) => {
      setData((b) => ({ ...b, [text]: e.target.value }));
    },
    [setData]
  );

  async function handleSubmit() {
    await axios
      .post(`${SHORTIFY_ENDPOINT}/api/v1/shorten`, data)
      .then((resp) => {
        setFetchedData(resp.data);
      })
      .catch((err) => {
        setFetchErr(err);

        console.log(err);
      });
    setData(intialState);
  }

  return (
    <>
      <div className="container">
        <Container>
          <StyledBox>
            <StyledBox>
              <h1>Acme Corp - URL shortner</h1>
            </StyledBox>
            <StyledBox>
              <StyledInput
                type="url"
                placeholder="paste in your long url"
                onChange={(e: any) => handleData(e, "longUrl")}
                value={data.longUrl}
                name="longUrl"
              />
              <p>If you wish to type, Start with http://</p>
            </StyledBox>
            <StyledBox>
              <StyledInput
                type="number"
                placeholder="How many minutes"
                min={0}
                onChange={(e: any) => handleData(e, "expiresIn")}
                value={data.expiresIn}
                name="expiresIn"
              />

              <p>How many minutes?</p>
            </StyledBox>
            <StyledBox>
              <StyledInput
                type="text"
                placeholder="Add a custom short code - 5 characters, Max"
                onChange={(e: any) => handleData(e, "customCode")}
                value={data.customCode}
                maxLength={5}
              />
              {window.location.origin}/{data.customCode}
            </StyledBox>

            <StyledBtn onClick={handleSubmit}>Stringify </StyledBtn>
          </StyledBox>
          {fetchErr ? (
            <p>
              An error has occured with your Input: verify if it is a valid url and try again! &nbsp;
              <p> {JSON.stringify(fetchErr)}</p>
            </p>
          ) : null}
          {fetcheddata?.shortUrl && (
            <>
              <span> Here is your link: </span>
              <a
                href={`${REDIRECT_ENDPOINT}/api/v1/redirect/${fetcheddata.shortCode}`}
                target="_blank"
                rel="noreferrer"
              >
                {fetcheddata.shortUrl}
              </a>
              <div>
                <ClipboardIcon
                  onClick={() => {
                    toaster.success("Copied to clipboard!");
                    copyUrl();
                  }}
                ></ClipboardIcon>
                &nbsp;
                <span>Copy the link</span>
              </div>
            </>
          )}

          <div className="container ">
            <h2>DASHBOARD</h2>
            <Analytics />
          </div>
        </Container>
      </div>
    </>
  );
}

export default function Wrapper() {
  return (
    <QueryClientProvider client={client}>
      <App />
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
}
