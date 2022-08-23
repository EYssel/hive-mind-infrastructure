import { Environment, Stack, StackProps } from 'aws-cdk-lib';
import { ComputeType, LinuxBuildImage, PipelineProject } from 'aws-cdk-lib/aws-codebuild';
import { Code, Repository } from 'aws-cdk-lib/aws-codecommit';
import { Artifact, Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import { CodeBuildAction, CodeCommitSourceAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { Construct } from 'constructs';

export interface ProjectStackProps extends StackProps {
    infrastructureName: string;
}

export class PipelineInfrastructureStack extends Stack {
    constructor(scope: Construct, id: string, props: Omit<StackProps, 'env'> & { infrastructureName: string; deployEnv: string; env: Environment }) {
        super(scope, id, props);

        const pipeline = new Pipeline(this, 'Infrastructure-Pipeline', {
            pipelineName: `${props.infrastructureName}-Pipeline`,
            crossAccountKeys: false,
        });

        // Source
        const codeCommitRepository = new Repository(this, 'Infrastructure-Repository', {
            repositoryName: `${props.infrastructureName}`,
            description: `Repository for ${props.infrastructureName}`,
            code: Code.fromDirectory(`../../common/init`, `master`),
        });

        const sourceOutput = new Artifact(`${props.infrastructureName}-source-artifacts`);

        let deployBranch = ``;

        if (props.deployEnv.toLowerCase() === `dev`) {
            deployBranch = `development`;
        } else if (props.deployEnv.toLowerCase() === `uat`) {
            deployBranch = `uat`;
        } else if (props.deployEnv.toLowerCase() === `prod`) {
            deployBranch = `master`;
        }

        const codeCommitAction = new CodeCommitSourceAction({
            actionName: `Source-Action`,
            output: sourceOutput,
            repository: codeCommitRepository,
            branch: deployBranch,
        });
        pipeline.addStage({
            stageName: `Source`,
            actions: [codeCommitAction],
        });

        // Build
        const codeBuildProject = new PipelineProject(this, `Infrastructure-Pipeline-Project`, {
            projectName: props.infrastructureName,
            environment: {
                buildImage: LinuxBuildImage.AMAZON_LINUX_2_4,
                computeType: ComputeType.SMALL
            },
        });

        const buildOutput = new Artifact(`${props.infrastructureName}-build-artifacts`);

        const codeBuildAction = new CodeBuildAction({
            actionName: `Build-Action`,
            input: sourceOutput,
            project: codeBuildProject,
            outputs: [buildOutput],
        });

        pipeline.addStage({
            stageName: `Build`,
            actions: [codeBuildAction],
        });
    }
}
