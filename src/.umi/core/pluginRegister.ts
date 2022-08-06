// @ts-nocheck
import { plugin } from './plugin';
import * as Plugin_0 from '@@/plugin-antd-icon-config/app.ts';
import * as Plugin_1 from 'E:/公司代码/MRP报表/vip-manager/src/.umi/plugin-dva/runtime.tsx';
import * as Plugin_2 from '../plugin-initial-state/runtime';
import * as Plugin_3 from 'E:/公司代码/MRP报表/vip-manager/src/.umi/plugin-locale/runtime.tsx';
import * as Plugin_4 from '../plugin-model/runtime';
import * as Plugin_5 from '@@/plugin-qiankun/masterRuntimePlugin';

  plugin.register({
    apply: Plugin_0,
    path: '@@/plugin-antd-icon-config/app.ts',
  });
  plugin.register({
    apply: Plugin_1,
    path: 'E:/公司代码/MRP报表/vip-manager/src/.umi/plugin-dva/runtime.tsx',
  });
  plugin.register({
    apply: Plugin_2,
    path: '../plugin-initial-state/runtime',
  });
  plugin.register({
    apply: Plugin_3,
    path: 'E:/公司代码/MRP报表/vip-manager/src/.umi/plugin-locale/runtime.tsx',
  });
  plugin.register({
    apply: Plugin_4,
    path: '../plugin-model/runtime',
  });
  plugin.register({
    apply: Plugin_5,
    path: '@@/plugin-qiankun/masterRuntimePlugin',
  });

export const __mfsu = 1;
