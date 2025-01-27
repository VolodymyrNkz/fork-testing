export const parseHTML = (html: string) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  const recursiveParse = (node: ChildNode, key: string): React.ReactNode => {
    if (node.nodeType === Node.TEXT_NODE) {
      return <span key={key}>{node.textContent}</span>;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const children = Array.from(element.childNodes).map((child, index) =>
        recursiveParse(child, `${key}-${index}`),
      );
      switch (element.tagName.toLowerCase()) {
        case 'br':
          return <br key={key} />;
        case 'strong':
          return <strong key={key}>{children}</strong>;
        case 'em':
          return <em key={key}>{children}</em>;
        case 'p':
          return <p key={key}>{children}</p>;
        default:
          return <span key={key}>{children}</span>;
      }
    }
    return null;
  };

  return Array.from(tempDiv.childNodes).map((node, index) => recursiveParse(node, `node-${index}`));
};
