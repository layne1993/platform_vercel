import React, { createRef } from 'react';
import { Form } from 'antd';
import { FormInstance } from 'antd/lib/form/hooks/useForm';

class Test extends React.Component<any, any> {
    formRef: React.RefObject<any> = createRef();
    render() {
        return (
            <div>
                <Form ref={this.formRef}></Form>
            </div>
        );
    }
}
