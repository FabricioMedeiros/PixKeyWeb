using FluentValidation;
using PixWeb.Application.Dtos;
using PixWeb.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace PixWeb.Application.Validators
{
    public class PixKeyValidator : AbstractValidator<PixKeyBaseDto>
    {
        public PixKeyValidator()
        {

            RuleFor(x => x.Description)
                 .NotEmpty().WithMessage("O campo Description é obrigatório.");

            RuleFor(x => x.IsPersonalKey)
               .NotNull()
               .WithMessage("O campo IsPersonalKey é obrigatório.");

            RuleFor(x => x.KeyType)
                .NotNull()
                .WithMessage("O campo KeyType é obrigatório.")
                .Must(IsValidKeyType)
                .WithMessage("O valor fornecido para KeyType não é válido.");

            RuleFor(pixKey => pixKey.Key)
                .NotEmpty().WithMessage("O campo Key é obrigatório.")
                .Must((pixKey, key) => ValidateKeyByType(pixKey.KeyType, key))
                .WithMessage("A chave não é válida para o tipo especificado.");

        }

        private bool IsValidKeyType(KeyType keyType)
        {
            return Enum.IsDefined(typeof(KeyType), keyType);
        }

        private bool ValidateKeyByType(KeyType keyType, string key)
        {
            switch (keyType)
            {
                case KeyType.CPF_CNPJ:
                    return new CpfValidator().Validate(new ValidationContext<string>(key)).IsValid ||
                           new CnpjValidator().Validate(new ValidationContext<string>(key)).IsValid;
                case KeyType.Email:
                    return new EmailAddressAttribute().IsValid(key);
                case KeyType.PhoneNumber:
                    return ValidatePhoneNumber(key);
                case KeyType.RandomKey:
                    return Guid.TryParse(key, out _);
                default:
                    return false;
            }
        }

        private bool ValidatePhoneNumber(string key)
        {
            return key.Length >= 10 && key.Length <= 11;
        }
    }
}
