// 简单类型typeof值列表
export const simpleTypes = ['string', 'number', 'boolean', 'bigint', 'symbol'] as const;
export type SimpleType = string | number | boolean | bigint | symbol;

// 基础数据类型
export type PrimitiveType = SimpleType | null | undefined;
