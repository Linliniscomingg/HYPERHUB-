import { useState, useEffect, useContext, useCallback, useRef } from "react";
import Axios from "axios";
import { ViewContext } from "../context/View";

export function useAPI(url, method, onError) {
  // wrap in useRef to prevent triggering useEffect multiple times
  const context = useRef(useContext(ViewContext));
  const [state, setState] = useState({ data: null, loading: true });

  const fetch = useCallback(async () => {
    try {
      if (!url) {
        setState({ data: null, loading: false });
        return false;
      }
      // setState({ loading: true });
      let res;
      await Axios({
        url: url,
        method: method || "get",
      })
        .then((response) => {
          res = response;
        })
        .catch((err) => {
          console.log(err);
          if (onError) onError(err);
          //throw err;
        });
    
      setState({ data: res.data, loading: false });
    } catch (err) {
      context?.current && context.current.handleError(err);
    }
  }, [url, method, context]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return state;
}
