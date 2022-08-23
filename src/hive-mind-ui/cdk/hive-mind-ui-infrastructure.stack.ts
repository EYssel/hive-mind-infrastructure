import { App, Environment, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { InfrastructureStack } from '../../common/infrastructure-stack';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

const cdkApp = new App();

export class HiveMindInfrastructureStack extends Stack {
    constructor(scope: Construct, id: string, props: Omit<StackProps, 'env'> & { env: Environment }) {
        super(scope, id, props);

        const infrastructure = new InfrastructureStack(this, 'HiveMind-Ui-Infrastructure', {
            infrastructureName: `HiveMindUi`,
            deployEnv: `dev`,
            env: props.env,
        });
    }
}

new HiveMindInfrastructureStack(cdkApp, `HiveMind-Infrastructure-Stack`, {
    env: {
        account: '836828574614',
        region: 'eu-west-1',
    },
});
