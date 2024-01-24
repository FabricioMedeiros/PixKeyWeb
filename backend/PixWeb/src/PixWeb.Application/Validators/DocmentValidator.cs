using DocumentValidator;
using FluentValidation;

namespace PixWeb.Application.Validators
{
    public class CpfValidator : AbstractValidator<string>
    {
        public CpfValidator()
        {
            RuleFor(cpf => cpf)
                .Must(ValidateCpf)
                .WithMessage("CPF inválido.");
        }

        private bool ValidateCpf(string cpf)
        {
            return CpfValidation.Validate(cpf);
        }
    }

    public class CnpjValidator : AbstractValidator<string>
    {
        public CnpjValidator()
        {
            RuleFor(cnpj => cnpj)
                .Must(ValidateCnpj)
                .WithMessage("CNPJ inválido.");
        }

        private bool ValidateCnpj(string cnpj)
        {
            return CnpjValidation.Validate(cnpj);
        }
    }

}
