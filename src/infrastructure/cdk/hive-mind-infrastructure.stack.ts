import { App, Environment, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { PipelineInfrastructureStack } from '../../common/pipeline-infrastructure-stack';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

const cdkApp = new App();

export class HiveMindInfrastructureStack extends Stack {
    constructor(scope: Construct, id: string, props: Omit<StackProps, 'env'> & { env: Environment }) {
        super(scope, id, props);

        const hiveMindUiInfrastructure = new PipelineInfrastructureStack(this, 'HiveMind-UI-Infrastructure', {
            infrastructureName: `HiveMind-UI`,
            deployEnv: `dev`,
            env: props.env,
        });

        const hiveMindUserManagementInfrastructure = new PipelineInfrastructureStack(this, 'HiveMind-Usermanagement-Infrastructure', {
            infrastructureName: `HiveMind-UserManagement`,
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
