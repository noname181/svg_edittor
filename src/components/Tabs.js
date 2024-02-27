/*

  <Tabs defaultTab={defaultTab}>
    <Tab title="A title" name="alpha">
      <Your content />
    </Tab>
    <Tab title="Another title" name="beta">
      <Your content />
    </Tab>
  </Tabs>

 */

import React, { useState, useEffect } from 'react';
import './Tabs.scss';


// custom array join, because native doesn't work with JSX
const jsxJoin = (array, str) => {
  return array.length > 0
    ? array.reduce((result, item) => <React.Fragment>{result}{str}{item}</React.Fragment>)
    : null;
}


const Tabs = (props) => {

  const [activeTab, setActiveTab] = useState(props.defaultTab || null)

  // update tab if default tab changes
  useEffect(() => {
    setActiveTab(props.defaultTab)
  }, [props.defaultTab])


  const listTabTitles = () => {
    let titles = [];
    props.children.forEach((child, index) => {
      let cssClass = ((activeTab === child.props.name) || (!activeTab && index === 0))
        ? 'button active'
        : 'button';
      titles.push(<div className={cssClass} onClick={ () => setActiveTab(child.props.name) }>{child.props.title}</div>);
    });

    return jsxJoin(titles, <div className="sep">|</div>);
  }

  const listTabContents = () => {
    let contents = [];
    props.children.forEach((child, index) => {
      let cssClass = activeTab === child.props.name
        ? 'tab active'
        : 'tab';

      // note: I can safely use index as a key because this will never be reordered or filtered
      contents.push(<div key={index} className={cssClass}>{child.props.children}</div>);
    });

    return contents;
  }


  return (
    <div className="tabs">
      <div className="tablist">{listTabTitles()}</div>
      {listTabContents()}
    </div>
  )
}


const Tab = (props) => (
  <div className="tab">
    {props.children}
  </div>
)



export { Tabs, Tab }
