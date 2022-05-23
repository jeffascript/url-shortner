import { Pane, Badge, Text, Pill } from "evergreen-ui";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { REDIRECT_ENDPOINT } from "../config";
import Moment from "react-moment";
import moment from "moment";
import { useQuery } from "react-query";
import { AnalyticsData } from "../types/Analytics";

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const isMounted = React.useRef(false);

  async function fetchAnalytics(): Promise<AnalyticsData[]> {
    const res = await axios.get(`${REDIRECT_ENDPOINT}/api/v1/all`);
    return res.data.response;
  }

  const {
    isLoading,
    isError,
    data: queryData,
    error,
  } = useQuery("shortners", fetchAnalytics, {
    // Refetch the data every 10seconds
    refetchInterval: 10000, //ms
  });

  // due to changes in the react v.18, we need to use this hook to make sure it runs only once
  useEffect(() => {
    if (isMounted.current) return;
    async function fetchAllData() {
      axios
        .get(`${REDIRECT_ENDPOINT}/api/v1/all`)
        .then((resp) => setAnalyticsData(resp.data.response))
        .catch((err) => {
          console.log(err);
        });
    }
    fetchAllData();
    return () => {
      isMounted.current = true;
    };
  }, []);

  console.log(analyticsData);

  function handleTime(data: string, time: number) {
    const formatedDate = moment(data);
    const returnedEndDate = moment(formatedDate).add(time, "seconds");
    return returnedEndDate;
  }

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Some Issue with getting back the Data! Try later {error as string}</span>;
  }

  return (
    <>
      {queryData &&
        queryData.length > 0 &&
        queryData.map((data) => (
          <Pane key={data.shortCode}>
            <Pane display="flex" alignItems="center" marginBottom={16}>
              <Pane flexBasis={120}>
                <Badge color="green">
                  Available
                  <Moment duration={handleTime(data.createdAt, +data.expiresIn)} date={data.createdAt} />
                </Badge>
              </Pane>
              <Pane>
                <Text>
                  <a href={`${REDIRECT_ENDPOINT}/api/v1/redirect/${data.shortCode}`} target="_blank" rel="noreferrer">
                    {data.shortUrl}
                  </a>
                </Text>
              </Pane>
              <Pill display="inline-flex" margin={8}>
                {data.visitorCount} clicks
              </Pill>
            </Pane>
          </Pane>
        ))}
    </>
  );
};

export default Analytics;
