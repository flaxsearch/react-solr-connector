jest.disableAutomock();

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import SolrConnector from '../src/react-solr-connector';
import fetchMock from 'fetch-mock';

if (window.Headers === undefined) {
  console.log("setting mock window.Headers");
  window.Headers = () => null;
}

describe("react-solr-connector", () => {
  it("injects props.solrConnector", () => {
    const Child = props => <div className="child">
        {props.solrConnector ? "exists" : ""}</div>;
    const sc = <SolrConnector><Child/></SolrConnector>;
    const comp = TestUtils.renderIntoDocument(sc);
    const child = TestUtils.findRenderedDOMComponentWithClass(comp, "child");
    expect(child.textContent).toBe("exists");
  });

  it("is not busy at first", () => {
    const Child = props => <div className="child">
        {props.solrConnector.busy === false ? "yes": "no"}</div>;
    const sc = <SolrConnector><Child/></SolrConnector>;
    const comp = TestUtils.renderIntoDocument(sc);
    const child = TestUtils.findRenderedDOMComponentWithClass(comp, "child");
    expect(child.textContent).toBe("yes");
  });

  it("has valid search results", () => {
    // use a Promise so we can check the Child props asynchronously
    let Child = null;
    let prom = new Promise(resolve => {
      Child = props => {
        if (props.solrConnector.response) {
          expect(props.solrConnector.busy).toBe(false);
          expect(props.solrConnector.error).toBeNull();
          resolve(props.solrConnector.response);
        }
        return <div className="child"></div>;
      };
    });

    const searchParams = {
      solrSearchUrl: "http://fetch.mock/response",
      query: "banana"
    };
    const sc = <SolrConnector searchParams={searchParams}>
      <Child/></SolrConnector>;
    const comp = TestUtils.renderIntoDocument(sc);

    // wait for the response
    return prom.then(response => {
      expect(response.response.numFound).toBe(5);
      expect(response.response.docs.length).toBe(2);
      expect(response.response.docs[0].id).toBe("VS1GB400C3");
    });
  });

  it("doesn't search if query is empty", () => {
    // use a Promise so we can check the Child props asynchronously
    let Child = null;
    let prom = new Promise(resolve => {
      Child = props => {
        expect(props.solrConnector.response).toBe(null);
        if (props.solrConnector.busy === false) {
          resolve(null);
        }
        return <div className="child"></div>;
      };
    });

    const searchParams = {
      solrSearchUrl: "http://fetch.mock/response",
      query: ""
    };
    const sc = <SolrConnector searchParams={searchParams}>
      <Child/></SolrConnector>;
    const comp = TestUtils.renderIntoDocument(sc);

    // wait for the response
    return prom.then(response => {});
  });

  it("has handles error from server", () => {
    // use a Promise so we can check the Child props asynchronously
    let Child = null;
    let prom = new Promise(resolve => {
      Child = props => {
        if (props.solrConnector.error) {
          expect(props.solrConnector.busy).toBe(false);
          expect(props.solrConnector.response).toBeNull();
          resolve(props.solrConnector.error);
        }
        return <div className="child" onClick={() => {
          props.solrConnector.doSearch();
        }}></div>;
      };
    });

    const searchParams = {
      solrSearchUrl: "http://fetch.mock/badRequest",
      query: "banana"
    };
    const sc = <SolrConnector searchParams={searchParams}>
      <Child/></SolrConnector>;
    const comp = TestUtils.renderIntoDocument(sc);

    // wait for the response
    return prom.then(error => {
      expect(error).toBe("400 Bad Request");
    });
  });

});

// set up fetch mocks

const mockSolrResponse = {
  "responseHeader":{
    "status":0,
    "QTime":3,
    "params":{
      "json":"{ query:memory, limit:2, facet:{manu_id_s:{field:manu_id_s}}, params:{wt:json, indent:true, hl:true, hl.fl:name, hl.snippets:1, hl.fragsize:500 } }"}},
  "response":{"numFound":5,"start":0,"docs":[
      {
        "id":"VS1GB400C3",
        "name":"CORSAIR ValueSelect 1GB 184-Pin DDR SDRAM Unbuffered DDR 400 (PC 3200) System Memory - Retail"},
      {
        "id":"VDBDB1A16",
        "name":"A-DATA V-Series 1GB 184-Pin DDR SDRAM Unbuffered DDR 400 (PC 3200) System Memory - OEM"}]
  },
  "facets":{
    "count":5,
    "manu_id_s":{
      "buckets":[{
          "val":"corsair",
          "count":3},
        {
          "val":"asus",
          "count":1},
        {
          "val":"canon",
          "count":1}]}},
  "highlighting":{
    "VS1GB400C3":{
      "name":["CORSAIR ValueSelect 1GB 184-Pin DDR SDRAM Unbuffered DDR 400 (PC 3200) System <em>Memory</em> - Retail"]},
    "VDBDB1A16":{
      "name":["A-DATA V-Series 1GB 184-Pin DDR SDRAM Unbuffered DDR 400 (PC 3200) System <em>Memory</em> - OEM"]}}};


// this is required to stop jest trying to hoist fetchMock.mock calls
const mok = fetchMock.mock.bind(fetchMock);

mok("http://fetch.mock/response", mockSolrResponse);
mok("http://fetch.mock/badRequest", 400);
