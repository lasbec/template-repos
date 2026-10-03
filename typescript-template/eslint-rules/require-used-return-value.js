import ts from 'typescript';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require meaningful function return values to be used.',
    },
    schema: [],
    messages: { unused: 'Use the return value of this function call.' },
  },
  create(context) {
    const services = context.sourceCode.parserServices;
    const checker = services.program.getTypeChecker();

    function mayDiscard(type) {
      if (type.flags & (ts.TypeFlags.Void | ts.TypeFlags.Never)) return true;
      if (type.isThisType) return true;
      if (type.isUnion()) return type.types.every(mayDiscard);
      if (type.getSymbol()?.getName() === 'Promise') {
        const [value] = checker.getTypeArguments(type);
        return (
          value !== undefined &&
          (Boolean(value.flags & ts.TypeFlags.Void) ||
            value.isThisType === true)
        );
      }
      return false;
    }

    function isDiscarded(node) {
      const parent = node.parent;
      if (!parent) return false;
      switch (parent.type) {
        case 'ExpressionStatement':
          return true;
        case 'AwaitExpression':
        case 'ChainExpression':
        case 'TSAsExpression':
        case 'TSTypeAssertion':
        case 'TSNonNullExpression':
        case 'TSSatisfiesExpression':
          return isDiscarded(parent);
        case 'UnaryExpression':
          return parent.operator === 'void';
        case 'SequenceExpression':
          return parent.expressions.at(-1) !== node || isDiscarded(parent);
        case 'ConditionalExpression':
          return parent.test !== node && isDiscarded(parent);
        case 'LogicalExpression':
          return parent.right === node && isDiscarded(parent);
        case 'ForStatement':
          return parent.init === node || parent.update === node;
        default:
          return false;
      }
    }

    return {
      CallExpression(node) {
        if (!isDiscarded(node)) return;
        const signature = checker.getResolvedSignature(
          services.esTreeNodeToTSNodeMap.get(node),
        );
        if (!signature) return;
        // Instantiated calls replace polymorphic this with the receiver's class.
        const declarationSignature = signature.declaration
          ? checker.getSignatureFromDeclaration(signature.declaration)
          : undefined;
        if (
          !mayDiscard(checker.getReturnTypeOfSignature(signature)) &&
          (!declarationSignature ||
            !mayDiscard(checker.getReturnTypeOfSignature(declarationSignature)))
        ) {
          context.report({ node, messageId: 'unused' });
        }
      },
    };
  },
};
