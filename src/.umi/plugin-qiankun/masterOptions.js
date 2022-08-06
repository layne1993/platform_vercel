
      let options = {"masterHistoryType":"browser","base":"/vipmanager/","apps":[{"name":"mackNew"}]};
      export const getMasterOptions = () => options;
      export const setMasterOptions = (newOpts) => options = ({ ...options, ...newOpts });
      