import { BadRequestException, ValidationError } from '@nestjs/common';

/**
 * Translates class-validator constraint failures into Indonesian messages so
 * the API never returns the default English ones ("email must be an email").
 * Numeric bounds (min/max/length) are pulled out of the original message.
 */

const firstNumber = (msg: string) => msg.match(/-?\d+(\.\d+)?/)?.[0] ?? '';

const TRANSLATORS: Record<string, (property: string, msg: string) => string> = {
  isNotEmpty: (p) => `${p} wajib diisi`,
  isDefined: (p) => `${p} wajib diisi`,
  isEmail: (p) => `${p} harus berupa alamat email yang valid`,
  isString: (p) => `${p} harus berupa teks`,
  isNumber: (p) => `${p} harus berupa angka`,
  isInt: (p) => `${p} harus berupa bilangan bulat`,
  isPositive: (p) => `${p} harus lebih besar dari 0`,
  isBoolean: (p) => `${p} harus berupa nilai benar/salah`,
  isEnum: (p) => `nilai ${p} tidak valid`,
  isArray: (p) => `${p} harus berupa daftar`,
  isDateString: (p) => `${p} harus berupa tanggal yang valid`,
  isDate: (p) => `${p} harus berupa tanggal yang valid`,
  isUrl: (p) => `${p} harus berupa URL yang valid`,
  isUuid: (p) => `${p} harus berupa ID yang valid`,
  isPhoneNumber: (p) => `${p} harus berupa nomor telepon yang valid`,
  min: (p, m) => `${p} minimal ${firstNumber(m)}`,
  max: (p, m) => `${p} maksimal ${firstNumber(m)}`,
  minLength: (p, m) => `${p} minimal ${firstNumber(m)} karakter`,
  maxLength: (p, m) => `${p} maksimal ${firstNumber(m)} karakter`,
  whitelistValidation: (p) => `properti ${p} tidak diperbolehkan`,
};

function collectMessages(errors: ValidationError[], parent = ''): string[] {
  return errors.flatMap((err) => {
    const property = parent ? `${parent}.${err.property}` : err.property;
    const own = Object.entries(err.constraints ?? {}).map(
      ([key, originalMsg]) =>
        TRANSLATORS[key]?.(property, originalMsg) ?? `${property} tidak valid`,
    );
    const nested = err.children?.length
      ? collectMessages(err.children, property)
      : [];
    return [...own, ...nested];
  });
}

export function validationExceptionFactory(errors: ValidationError[]) {
  return new BadRequestException(collectMessages(errors));
}
