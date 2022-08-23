import { App, Environment, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { InfrastructureStack } from '../../common/infrastructure-stack';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

const cdkApp = new App();

export class HiveMindUiInfrastructureStack extends Stack {
    constructor(scope: Construct, id: string, props: Omit<StackProps, "env"> & { env: Environment }) {
        super(scope, id, props);

        const infrastructure = new InfrastructureStack(this, 'HiveMind-Ui-Infrastructure', {
            infrastructureName: `HiveMindUi`,
            env: props?.env,
        });
    }
}

new HiveMindUiInfrastructureStack(cdkApp, `HiveMindUi-Infrastructure-Stack`, {
    env: {
        account: '836828574614',
        region: 'eu-west-1',
    },
});
