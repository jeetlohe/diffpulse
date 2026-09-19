export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const template = body.template || '';

    let costScore = 0;
    const risks = [];
    const recommendations = [];

    // Extract all AWS Resource Types dynamically via Regex
    const resourceMatches = template.match(/Type:\s*['"]?(AWS::[A-Za-z0-9]+::[A-Za-z0-9]+)['"]?/g) || [];
    const detectedResources = [...new Set(resourceMatches.map(r => r.replace(/Type:\s*['"]?/, '').replace(/['"]?$/, '')))];

    // 1. Networking Checks
    if (template.includes('AWS::EC2::NatGateway')) {
      costScore += 50;
      risks.push('NAT Gateway detected (~$32.40/month base + $0.045/GB data processing).');
      recommendations.push('Swap NAT Gateway for VPC Endpoints or public subnets during testing.');
    }
    if (template.includes('AWS::ElasticLoadBalancingV2::LoadBalancer') || template.includes('AWS::ElasticLoadBalancing::LoadBalancer')) {
      costScore += 25;
      risks.push('Elastic Load Balancer (ALB/NLB) detected (~$18/month + LCU usage).');
      recommendations.push('For low-traffic dev environments, expose API Gateway or Lambda Function URLs directly.');
    }

    // 2. Compute Checks
    if (template.includes('AWS::EC2::Instance')) {
      const isMicro = template.includes('t2.micro') || template.includes('t3.micro') || template.includes('t4g.micro');
      if (!isMicro) {
        costScore += 35;
        risks.push('Non-Free Tier EC2 instance type detected (outside t2/t3/t4g.micro 750 free hrs/mo).');
        recommendations.push('Change EC2 InstanceType to t2.micro or t3.micro.');
      }
    }
    if (template.includes('AWS::EKS::Cluster')) {
      costScore += 45;
      risks.push('Amazon EKS Kubernetes Cluster detected (~$73/month control plane fee + node costs).');
      recommendations.push('Use ECS on Fargate or serverless AWS Lambda to avoid fixed cluster management fees.');
    }

    // 3. Database & Cache Checks
    if (template.includes('AWS::RDS::DBInstance')) {
      costScore += 30;
      if (template.includes('MultiAZ: true') || template.includes('MultiAZ: "true"')) {
        costScore += 20;
        risks.push('RDS Multi-AZ Deployment enabled (doubles database hourly instance and storage cost).');
        recommendations.push('Disable Multi-AZ for dev/test stacks.');
      } else {
        risks.push('Managed RDS DB Instance detected.');
      }
      recommendations.push('Consider DynamoDB (25 GB free storage) for zero-cost serverless data storage.');
    }
    if (template.includes('AWS::Redshift::Cluster')) {
      costScore += 50;
      risks.push('Amazon Redshift Data Warehouse cluster detected (~$180+/month baseline cost).');
      recommendations.push('Query S3 data using Amazon Athena (pay per query) instead of a dedicated cluster.');
    }
    if (template.includes('AWS::ElastiCache::CacheCluster')) {
      costScore += 25;
      risks.push('ElastiCache Redis/Memcached cluster detected.');
      recommendations.push('Use in-memory application caching or DynamoDB DAX free tier where applicable.');
    }

    // 4. Analytics & Search
    if (template.includes('AWS::OpenSearch::Domain') || template.includes('AWS::Elasticsearch::Domain')) {
      costScore += 35;
      risks.push('OpenSearch / Elasticsearch cluster detected (~$30+/month instance baseline).');
    }

    // 5. Positive Free-Tier Acknowledgments
    if (template.includes('AWS::Lambda::Function')) {
      recommendations.push('Lambda detected: Covered by 1M free requests and 3.2M seconds compute time monthly.');
    }
    if (template.includes('AWS::DynamoDB::Table')) {
      recommendations.push('DynamoDB detected: Includes 25 GB free storage and 25 write/read capacity units.');
    }
    if (template.includes('AWS::S3::Bucket')) {
      recommendations.push('S3 Bucket detected: Includes 5 GB free standard storage.');
    }

    // Summary Generator
    const finalScore = Math.min(costScore, 100);
    const summary = detectedResources.length > 0 
      ? `Analyzed ${detectedResources.length} distinct resource type(s): ${detectedResources.join(', ')}.`
      : 'No standard AWS resources explicitly declared in template.';

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST'
      },
      body: JSON.stringify({
        costScore: finalScore,
        detectedResources,
        resourceCount: detectedResources.length,
        summary,
        risks,
        recommendations,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Malformed CloudFormation JSON/YAML template' })
    };
  }
};
