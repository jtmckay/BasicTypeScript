class BreakablePromise extends Promise<{}> {
  constructor(props){
    super(props);
  }
  break: Function;
}

export default function ajax(
  url: string,
  data: Object = null
) {
    let xreq = new XMLHttpRequest();
    let res = new BreakablePromise(function (resolve, reject) {
      xreq.open("POST", url, true);
      xreq.setRequestHeader("Content-type", "application/json");
      xreq.onload = function () {
          if (xreq.status == 200) {
              resolve(JSON.parse(xreq.response));
          }
          else {
              reject(xreq.statusText);
          }
      };
      xreq.onerror = function () {
          reject(Error("Network Error"));
      }
      if (data) {
          xreq.send(JSON.stringify(data));
      }
      else {
          xreq.send();
      }
    });
    res.break = function () {
        xreq.abort();
    };
    return res;
}
